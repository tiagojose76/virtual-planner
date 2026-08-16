#pragma once

#include <string>
#include <cstdint>
#include <stdexcept>

namespace virtual_planner::domain {

class User {
private:
    std::uint64_t id_;
    std::string name_;
    std::string email_;

    // Declaração das regras de validação
    void validate_name(const std::string& name) const;
    void validate_email(const std::string& email) const;

public:
    User(std::uint64_t id, std::string name, std::string email);

    [[nodiscard]] std::uint64_t id() const;
    [[nodiscard]] const std::string& name() const;
    [[nodiscard]] const std::string& email() const;

    void update_name(const std::string& new_name);
    void update_email(const std::string& new_email);
};

} // namespace virtual_planner::domain