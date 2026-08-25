#include "virtual_planner/application/goal/list_goals_use_case.hpp"

namespace virtual_planner::application {

ListGoalsUseCase::ListGoalsUseCase(
    persistence::GoalRepository& repository)
    : repository_(repository)
{
}

std::vector<domain::Goal>
ListGoalsUseCase::execute(
    const domain::Date& start_date,
    const domain::Date& end_date) const
{
    return repository_.find_by_date_range(
        start_date,
        end_date);
}

} // namespace virtual_planner::application