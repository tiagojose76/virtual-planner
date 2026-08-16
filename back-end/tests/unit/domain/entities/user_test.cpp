#include "virtual_planner/domain/entities/user.hpp"
#include "support/expect.hpp"
#include <stdexcept>

using namespace virtual_planner::domain;

void test_user_creation_and_getters() {
    User user(1, "Gabriel", "gabriel@example.com");
    VP_EXPECT(user.id() == 1, "O ID do usuario deve ser 1");
    VP_EXPECT(user.name() == "Gabriel", "O nome do usuario deve corresponder ao valor inicial");
    VP_EXPECT(user.email() == "gabriel@example.com", "O email do usuario deve corresponder ao valor inicial");
}

void test_user_updates() {
    User user(1, "Nome Antigo", "old@example.com");
    user.update_name("Nome Atualizado");
    user.update_email("new@example.com");
    VP_EXPECT(user.name() == "Nome Atualizado", "O nome do usuario deve ser atualizado corretamente");
    VP_EXPECT(user.email() == "new@example.com", "O email do usuario deve ser atualizado corretamente");
}

void test_user_validation_rejections() {
    // Testa rejeição de nome vazio
    bool rejected_empty_name = false;
    try { User user(1, "", "valido@example.com"); } 
    catch (const std::invalid_argument&) { rejected_empty_name = true; }
    VP_EXPECT(rejected_empty_name, "Deve rejeitar a criacao de usuario com nome vazio");

    // Testa rejeição do construtor com e-mail vazio (Ponto 3 da issue)
    bool rejected_empty_email_ctor = false;
    try { User user(1, "Gabriel", ""); } 
    catch (const std::invalid_argument&) { rejected_empty_email_ctor = true; }
    VP_EXPECT(rejected_empty_email_ctor, "Deve rejeitar a criacao de usuario com email vazio");

    // Testa rejeição de e-mail sem '@'
    bool rejected_invalid_email = false;
    try { User user(1, "Gabriel", "emailinvalido.com"); } 
    catch (const std::invalid_argument&) { rejected_invalid_email = true; }
    VP_EXPECT(rejected_invalid_email, "Deve rejeitar a criacao de usuario com email sem '@'");

    // Testa rejeição em métodos de atualização
    User valid_user(1, "Gabriel", "gabriel@example.com");
    
    bool rejected_update_name = false;
    try { valid_user.update_name(""); } 
    catch (const std::invalid_argument&) { rejected_update_name = true; }
    VP_EXPECT(rejected_update_name, "Deve rejeitar a atualizacao para um nome vazio");

    // Testa update com e-mail vazio
    bool rejected_update_email_empty = false;
    try { valid_user.update_email(""); } 
    catch (const std::invalid_argument&) { rejected_update_email_empty = true; }
    VP_EXPECT(rejected_update_email_empty, "Deve rejeitar a atualizacao para um email vazio");

    bool rejected_update_email_no_at = false;
    try { valid_user.update_email("sem-arroba"); } 
    catch (const std::invalid_argument&) { rejected_update_email_no_at = true; }
    VP_EXPECT(rejected_update_email_no_at, "Deve rejeitar a atualizacao para um email sem '@'");
}

int main() {
    test_user_creation_and_getters();
    test_user_updates();
    test_user_validation_rejections();

    return 0;
}