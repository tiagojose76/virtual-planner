#include "virtual_planner/application/reminder/delete_reminder_use_case.hpp"

#include "support/expect.hpp"
#include "virtual_planner/persistence/memory/in_memory_reminder_repository.hpp"

#include <chrono>
#include <stdexcept>
#include <string>

using namespace virtual_planner;

int main()
{
    persistence::InMemoryReminderRepository repositorio;

    // O id vem do repositorio (issue #90).
    const auto id = repositorio.save(domain::Reminder{
        0,
        "Excluir este lembrete",
        domain::Category::PersonalProjects,
        domain::Date{20, 8, 2026},
        domain::TimeSlot{std::chrono::hours{9}, std::chrono::hours{10}},
        domain::ReminderType::PhoneCall,
        domain::ReminderRecurrence::Once});

    application::DeleteReminderUseCase excluir(repositorio);
    excluir.execute(id);

    VP_EXPECT(!repositorio.find_by_id(id).has_value(), "a exclusão deve remover o lembrete existente");

    bool inexistente_rejeitado = false;

    try
    {
        excluir.execute(id);
    }
    catch (const std::runtime_error& error)
    {
        inexistente_rejeitado = std::string{error.what()} == "Lembrete não encontrado.";
    }

    VP_EXPECT(inexistente_rejeitado, "a exclusão deve informar um ID inexistente");

    return 0;
}
