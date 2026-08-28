#include <nlohmann/json.hpp>

#include "virtual_planner/api/json/goal_json.hpp"
#include "../../../support/expect.hpp"

using namespace virtual_planner;

int main()
{
    const domain::Goal original{
        42,
        "Finish C++ Planner",
        domain::Category::Study,
        domain::GoalStatus::InProgress,
        domain::GoalPeriod::Weekly,
        domain::Date{28, 8, 2026}
    };

    const nlohmann::json serialized = api::json::to_json(original);

    VP_EXPECT(serialized.at("id") == 42,
              "Goal id should serialize correctly");
    VP_EXPECT(serialized.at("description") == "Finish C++ Planner",
              "Goal description should serialize correctly");
    VP_EXPECT(serialized.at("category") == "Study",
              "Goal category should reuse shared JSON representation");
    VP_EXPECT(serialized.at("status") == "In Progress",
              "Goal status should reuse shared JSON representation");
    VP_EXPECT(serialized.at("period") == "Weekly",
              "Goal period should reuse shared JSON representation");
    VP_EXPECT(serialized.at("reference_date") == "2026-08-28",
              "Goal reference date should reuse shared JSON representation");

    const domain::Goal parsed = api::json::goal_from_json(serialized);

    VP_EXPECT(parsed.id() == original.id(),
              "Goal id should survive JSON round trip");
    VP_EXPECT(parsed.description() == original.description(),
              "Goal description should survive JSON round trip");
    VP_EXPECT(parsed.category() == original.category(),
              "Goal category should survive JSON round trip");
    VP_EXPECT(parsed.status() == original.status(),
              "Goal status should survive JSON round trip");
    VP_EXPECT(parsed.period() == original.period(),
              "Goal period should survive JSON round trip");
    VP_EXPECT(parsed.reference_date() == original.reference_date(),
              "Goal reference date should survive JSON round trip");

    return 0;
}