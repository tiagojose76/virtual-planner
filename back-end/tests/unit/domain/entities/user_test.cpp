#include "virtual_planner/domain/entities/user.hpp"
#include "support/expect.hpp"

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

int main() {
    test_user_creation_and_getters();
    test_user_updates();

    return 0;
}