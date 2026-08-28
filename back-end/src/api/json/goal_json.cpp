#include "virtual_planner/api/json/goal_json.hpp"

#include "virtual_planner/api/json/shared_json.hpp"

namespace virtual_planner::api::json {

nlohmann::json to_json(const domain::Goal& goal)
{
    return nlohmann::json{
        {"id", goal.id()},
        {"description", goal.description()},
        {"category", to_json(goal.category())},
        {"status", to_json(goal.status())},
        {"period", to_json(goal.period())},
        {"reference_date", to_json(goal.reference_date())}
    };
}

domain::Goal goal_from_json(const nlohmann::json& value)
{
    return domain::Goal{
        value.at("id").get<std::uint64_t>(),
        value.at("description").get<std::string>(),
        category_from_json(value.at("category")),
        goal_status_from_json(value.at("status")),
        goal_period_from_json(value.at("period")),
        date_from_json(value.at("reference_date"))
    };
}

} // namespace virtual_planner::api::json