#pragma once

#include "virtual_planner/persistence/user_repository.hpp"
#include "virtual_planner/infrastructure/postgres/postgres_database.hpp"
#include <memory>
#include <optional>
#include <string>

namespace virtual_planner::infrastructure::postgres {

class PostgresUserRepository : public persistence::UserRepository {
public:
    explicit PostgresUserRepository(std::shared_ptr<PostgresDatabase> database);

    domain::User save(const domain::User& user) override;
    std::optional<domain::User> find_by_id(int id) const override;
    std::optional<domain::User> find_by_email(const std::string& email) const override;

private:
    std::shared_ptr<PostgresDatabase> database_;
};

} // namespace virtual_planner::infrastructure::postgres