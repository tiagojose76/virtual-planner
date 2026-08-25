#include "virtual_planner/infrastructure/postgres/postgres_goal_repository.hpp"
#include <iomanip>
#include <sstream>
#if defined(VIRTUAL_PLANNER_WITH_POSTGRES)

#include <pqxx/pqxx>

namespace virtual_planner::infrastructure::postgres {

PostgresGoalRepository::PostgresGoalRepository(
    PostgresDatabase& database)
    : database_(database)
{
}

std::uint64_t PostgresGoalRepository::save(
    const domain::Goal& goal)
    
{
    pqxx::work transaction(database_.connection());

    auto result = transaction.exec(
    R"(
    INSERT INTO goals
(
    description,
    category,
    status,
    period,
    reference_date  
)
VALUES ($1,$2,$3,$4,$5)
RETURNING id
    )",
pqxx::params{
    transaction,
    goal.description(),
    to_string(goal.category()),
    to_string(goal.status()),
    to_string(goal.period()),
    date_to_postgres(goal.reference_date())});

    const auto id = result.one_row()["id"].as<std::uint64_t>();

    transaction.commit();

    return id;

}

void PostgresGoalRepository::update(
    const domain::Goal& goal)
{
    pqxx::work transaction(database_.connection());

    transaction.exec(
    R"(
    UPDATE goals
    SET
    description=$1,
    category=$2,
    status=$3,
    period=$4,
    reference_date=$5,
    updated_at=CURRENT_TIMESTAMP
WHERE id=$6
    )",
pqxx::params{
    transaction,
    goal.description(),
    to_string(goal.category()),
    to_string(goal.status()),
    to_string(goal.period()),
    date_to_postgres(goal.reference_date()),
    goal.id()}

    transaction.commit();
}

std::optional<domain::Goal>
PostgresGoalRepository::find_by_id(std::uint64_t id)
{
    pqxx::read_transaction transaction(database_.connection());

    auto result = transaction.exec(
        R"(
            SELECT
                id,
                description,
                category,
                status,
                period,
                reference_date
            FROM goals
            WHERE id = $1
        )",
        pqxx::params{transaction, id}
    );

    if (result.empty())
    {
        return std::nullopt;
    }

    const auto& row = result.front();

return domain::Goal(
    row["id"].as<std::uint64_t>(),
    row["description"].as<std::string>(),
    domain::category_from_string(
        row["category"].as<std::string>()),
    domain::goal_status_from_string(
        row["status"].as<std::string>()),
    domain::goal_period_from_string(
        row["period"].as<std::string>()),
    date_from_postgres(
        row["reference_date"].as<std::string>())
);


domain::Date date_from_postgres(
    const std::string& value)
{
    const auto year = static_cast<std::uint32_t>(
        std::stoul(value.substr(0, 4)));

    const auto month = static_cast<std::uint32_t>(
        std::stoul(value.substr(5, 2)));

    const auto day = static_cast<std::uint32_t>(
        std::stoul(value.substr(8, 2)));

    return domain::Date(day, month, year);
}

}

}

std::vector<domain::Goal>
PostgresGoalRepository::find_all()
{
    pqxx::read_transaction transaction(database_.connection());

    auto result = transaction.exec(
        R"(
            SELECT
            id,
            description,
            category,
            status,
            period,
            reference_date
        FROM goals
        ORDER BY id
        )"
    );

    std::vector<domain::Goal> goals;

    goals.reserve(result.size());

    for (const auto& row : result)
    {
goals.emplace_back(
    row["id"].as<std::uint64_t>(),
    row["description"].as<std::string>(),
    domain::category_from_string(
        row["category"].as<std::string>()),
    domain::goal_status_from_string(
        row["status"].as<std::string>()),
    domain::goal_period_from_string(
        row["period"].as<std::string>()),
    date_from_postgres(
        row["reference_date"].as<std::string>())
);
    }

    return goals;
}

namespace {

std::string date_to_postgres(
    const domain::Date& date)
{
    std::ostringstream stream;

    stream << date.year()
           << "-"
           << std::setfill('0')
           << std::setw(2) << date.month()
           << "-"
           << std::setw(2) << date.day();

     return std::to_string(date.year()) + "-" +
           (date.month() < 10 ? "0" : "") +
           std::to_string(date.month()) + "-" +
           (date.day() < 10 ? "0" : "") +
           std::to_string(date.day());
}


std::vector<domain::Goal>
PostgresGoalRepository::find_by_date_range(
    const domain::Date& start,
    const domain::Date& end)
{
    pqxx::read_transaction transaction(database_.connection());

    auto result = transaction.exec(
        R"(
            SELECT
                id,
                description,
                category,
                status,
                period,
                reference_date
            FROM goals
            WHERE reference_date BETWEEN $1 AND $2
            ORDER BY reference_date, id
        )",
        pqxx::params{
            transaction,
            date_to_postgres(start_date),
            date_to_postgres(end_date)
        });

    std::vector<domain::Goal> goals;

    goals.reserve(result.size());

    for (const auto& row : result)
    {
        goals.emplace_back(
            row["id"].as<std::uint64_t>(),
            row["description"].as<std::string>(),
            domain::category_from_string(
                row["category"].as<std::string>()),
            domain::goal_status_from_string(
                row["status"].as<std::string>()),
            domain::goal_period_from_string(
                row["period"].as<std::string>()),
            postgres_to_date(
                row["reference_date"].as<std::string>())
        );
    }

    return goals;
}

void PostgresGoalRepository::remove(
    std::uint64_t id)
{
    pqxx::work transaction(database_.connection());

    transaction.exec(
        "DELETE FROM goals WHERE id=$1",
        pqxx::params{transaction, id}).no_rows();

    transaction.commit();
}

} // namespace virtual_planner::infrastructure::postgres

#endif