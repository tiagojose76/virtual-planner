#include "virtual_planner/domain/entities/user.hpp"

namespace virtual_planner::domain {

// Implementação das validações
void User::validate_name(const std::string& name) const {
    if (name.empty()) {
        throw std::invalid_argument("Erro de Dominio: O nome nao pode ser vazio.");
    }
}

void User::validate_email(const std::string& email) const {
    if (email.empty() || email.find('@') == std::string::npos) {
        throw std::invalid_argument("Erro de Dominio: O email deve conter '@' e nao pode ser vazio.");
    }
}

// Construtor
User::User(std::uint64_t id, std::string name, std::string email) : id_(id) {
    validate_name(name);
    validate_email(email);
    name_ = std::move(name);
    email_ = std::move(email);
}

// Getters
std::uint64_t User::id() const { return id_; }
const std::string& User::name() const { return name_; }
const std::string& User::email() const { return email_; }

// Setters com validação
void User::update_name(const std::string& new_name) {
    validate_name(new_name);
    name_ = new_name;
}

void User::update_email(const std::string& new_email) {
    validate_email(new_email);
    email_ = new_email;
}

} // namespace virtual_planner::domain