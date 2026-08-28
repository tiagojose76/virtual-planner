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
        "Planejamento semanal",
        domain::Category::Work,
        domain::Date{20, 8, 2026},
        domain::TimeSlot{std::chrono::hours{9}, std::chrono::hours{10}},
        domain::ReminderType::Meeting,
        domain::ReminderRecurrence::Weekly};

    const auto id = criar.execute(requisicao);
    const auto armazenado = repositorio.find_by_id(id);

    VP_EXPECT(id != 0, "a criação deve retornar o ID gerado pelo repositório");
    VP_EXPECT(armazenado.has_value(), "o lembrete criado deve ser armazenado");
    VP_EXPECT(armazenado->id() == id, "o lembrete armazenado deve ter o ID retornado");
    VP_EXPECT(armazenado->description() == "Planejamento semanal", "a criação deve preservar a descrição");
    VP_EXPECT(armazenado->category() == domain::Category::Work, "a criação deve preservar a categoria");
    VP_EXPECT((armazenado->date() == domain::Date{20, 8, 2026}), "a criação deve preservar a data");
    VP_EXPECT(armazenado->time_slot().start() == std::chrono::hours{9}, "a criação deve preservar o horário inicial");
    VP_EXPECT(armazenado->time_slot().end() == std::chrono::hours{10}, "a criação deve preservar o horário final");
    VP_EXPECT(armazenado->type() == domain::ReminderType::Meeting, "a criação deve preservar o tipo");
    VP_EXPECT(armazenado->recurrence() == domain::ReminderRecurrence::Weekly, "a criação deve preservar a recorrência");

    // --- Regressão da issue #90 ---------------------------------------------
    //
    // Antes, o chamador escolhia o ID e save fazia upsert: criar dois
    // lembretes com o mesmo ID sobrescrevia o primeiro em silêncio. A guarda
    // do #87 protegia só este ponto de chamada, não o contrato. Agora o ID é
    // do repositório e não existe mais como um create apagar outro.
    const auto segundo_id = criar.execute(application::CreateReminderRequest{
        "Outro lembrete",
        domain::Category::Study,
        domain::Date{22, 8, 2026},
        domain::TimeSlot{std::chrono::hours{16}, std::chrono::hours{17}},
        domain::ReminderType::Study,
        domain::ReminderRecurrence::Once});

    VP_EXPECT(segundo_id != id, "duas criações devem receber IDs distintos");
    VP_EXPECT(repositorio.find_all().size() == 2, "duas criações devem resultar em dois lembretes");

    const auto primeiro = repositorio.find_by_id(id);

    VP_EXPECT(primeiro.has_value(), "o primeiro lembrete deve continuar armazenado");
    VP_EXPECT(primeiro->description() == "Planejamento semanal", "uma criação nova não deve sobrescrever a descrição da anterior");
    VP_EXPECT(primeiro->category() == domain::Category::Work, "uma criação nova não deve sobrescrever a categoria da anterior");
    VP_EXPECT((primeiro->date() == domain::Date{20, 8, 2026}), "uma criação nova não deve sobrescrever a data da anterior");
    VP_EXPECT(primeiro->type() == domain::ReminderType::Meeting, "uma criação nova não deve sobrescrever o tipo da anterior");

    // --- Descrição inválida --------------------------------------------------
    bool descricao_invalida_rejeitada = false;

    try
    {
        const auto id_nao_utilizado = criar.execute(application::CreateReminderRequest{
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
    VP_EXPECT(repositorio.find_all().size() == 2, "uma criação inválida não deve persistir um lembrete");

    return 0;
}
