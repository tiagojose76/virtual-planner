#include "virtual_planner/application/reminder/create_reminder_use_case.hpp"

#include "support/expect.hpp"
#include "virtual_planner/shared/errors.hpp"
#include "virtual_planner/persistence/memory/in_memory_reminder_repository.hpp"

#include <chrono>

using namespace virtual_planner;

int main()
{
    persistence::InMemoryReminderRepository repositorio;
    application::CreateReminderUseCase criar(repositorio);

    const application::CreateReminderRequest requisicao{
        42,
        "Planejamento semanal",
        domain::Category::Work,
        domain::Date{20, 8, 2026},
        domain::TimeSlot{std::chrono::hours{9}, std::chrono::hours{10}},
        domain::ReminderType::Meeting,
        domain::ReminderRecurrence::Weekly};

    const auto id = criar.execute(requisicao);
    const auto armazenado = repositorio.find_by_id(42);

    VP_EXPECT(id == 42, "a criação deve retornar o ID informado explicitamente");
    VP_EXPECT(armazenado.has_value(), "o lembrete criado deve ser armazenado");
    VP_EXPECT(armazenado->id() == 42, "a criação deve preservar o ID informado");
    VP_EXPECT(armazenado->description() == "Planejamento semanal", "a criação deve preservar a descrição");
    VP_EXPECT(armazenado->category() == domain::Category::Work, "a criação deve preservar a categoria");
    VP_EXPECT((armazenado->date() == domain::Date{20, 8, 2026}), "a criação deve preservar a data");
    VP_EXPECT(armazenado->time_slot().start() == std::chrono::hours{9}, "a criação deve preservar o horário inicial");
    VP_EXPECT(armazenado->time_slot().end() == std::chrono::hours{10}, "a criação deve preservar o horário final");
    VP_EXPECT(armazenado->type() == domain::ReminderType::Meeting, "a criação deve preservar o tipo");
    VP_EXPECT(armazenado->recurrence() == domain::ReminderRecurrence::Weekly, "a criação deve preservar a recorrência");

    bool descricao_invalida_rejeitada = false;

    try
    {
        const auto id_nao_utilizado = criar.execute(application::CreateReminderRequest{
            43,
            "   ",
            domain::Category::Study,
            domain::Date{21, 8, 2026},
            domain::TimeSlot{std::chrono::hours{14}, std::chrono::hours{15}},
            domain::ReminderType::Study,
            domain::ReminderRecurrence::Once});
        (void)id_nao_utilizado;
    }
    catch (const shared::DomainError&)
    {
        descricao_invalida_rejeitada = true;
    }

    VP_EXPECT(descricao_invalida_rejeitada, "a criação deve rejeitar uma descrição em branco");
    VP_EXPECT(!repositorio.find_by_id(43).has_value(), "uma criação inválida não deve persistir um lembrete");

    return 0;
}
