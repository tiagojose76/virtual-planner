#pragma once

#include <cstdint>
#include <string>

#include "virtual_planner/domain/entities/user.hpp"
#include "virtual_planner/persistence/user_repository.hpp"

namespace virtual_planner::application {

// Dados novos de perfil. So nome e email: sem senha nem qualquer campo de
// credencial, porque autenticacao esta fora do escopo do projeto.
struct UpdateUserProfileRequest
{
    std::string name;

    std::string email;
};

// Atualiza o perfil (nome e email) do usuario corrente.
//
// Mesma decisao de identidade do GetUserProfileUseCase: o id do usuario
// corrente e injetado no construtor pelo composition root, nunca recebido
// do chamador via execute().
class UpdateUserProfileUseCase
{
public:
    UpdateUserProfileUseCase(
        persistence::UserRepository& repository,
        std::uint64_t current_user_id);

    // Lanca std::runtime_error se o usuario corrente nao existir no
    // repositorio, e std::invalid_argument se nome ou email nao passarem na
    // validacao de dominio (User::validate_name / validate_email).
    void execute(const UpdateUserProfileRequest& request);

private:
    persistence::UserRepository& repository_;

    std::uint64_t current_user_id_;
};

} // namespace virtual_planner::application