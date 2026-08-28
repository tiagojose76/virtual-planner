# Contrato JSON da API

Este documento define o formato JSON usado na fronteira HTTP do backend.

Hoje ele cobre apenas os **tipos compartilhados** — enums e value objects de
domínio (P-29.0). A serialização de cada entidade (`Goal`, `Task`, `Reminder`,
`User`) é definida pelas issues P-29.1 a P-29.4 e deve, obrigatoriamente,
reutilizar as regras abaixo. O contrato REST completo (rotas, códigos de
status, corpos de erro) é escrito na P-56.

## Onde está o código

- `back-end/include/virtual_planner/api/json/shared_json.hpp`
- `back-end/src/api/json/shared_json.cpp`
- Testes de round-trip: `back-end/tests/unit/api/json/shared_json_test.cpp`

A serialização vive em `api`, não em `domain`: o domínio não conhece JSON e não
depende de `nlohmann/json`. As conversões reaproveitam `domain::to_string` e os
`*_from_string` de cada enum, então a representação textual do JSON é sempre a
mesma do domínio.

## Como habilitar

O módulo depende de `nlohmann/json`, baixado via `FetchContent`. Por isso está
atrás de uma opção, desligada por padrão, para que o build sem rede continue
funcionando:

```bash
cmake -S back-end -B back-end/build -DVIRTUAL_PLANNER_WITH_JSON=ON
cmake --build back-end/build
ctest --test-dir back-end/build --output-on-failure
```

`-DVIRTUAL_PLANNER_WITH_HTTP=ON` liga `VIRTUAL_PLANNER_WITH_JSON`
automaticamente — o servidor HTTP responde com este mesmo JSON.

## Regra geral

**Uma única representação por tipo em todo o projeto.** Não serialize um enum
ou um value object à mão em nenhum outro lugar: chame as funções de
`virtual_planner::api::json`. Se um formato precisar mudar, ele muda aqui e em
um só lugar.

Toda falha de desserialização lança `std::invalid_argument` — o mesmo tipo que
os `*_from_string` do domínio e os construtores de `Date` e `TimeSlot` já
lançam. O mapeamento desse erro para uma resposta HTTP é assunto da P-35.

## Enums

Todo enum compartilhado serializa como **string JSON em PascalCase**, com
exatamente o texto de `domain::to_string`.

| Tipo | Valores |
|---|---|
| `Category` | `"College"`, `"Work"`, `"Health"`, `"Leisure"`, `"PersonalProjects"`, `"Study"` |
| `GoalPeriod` | `"Weekly"`, `"Monthly"`, `"Yearly"` |
| `GoalStatus` | `"InProgress"`, `"Completed"`, `"PartiallyCompleted"`, `"Failed"` |
| `Priority` | `"Low"`, `"Medium"`, `"High"` |
| `ReminderRecurrence` | `"Once"`, `"Daily"`, `"Weekly"`, `"Monthly"` |
| `ReminderType` | `"Meeting"`, `"PhoneCall"`, `"Shopping"`, `"Study"`, `"Exercise"`, `"Assignment"` |
| `Shift` | `"Morning"`, `"Afternoon"`, `"Evening"` |
| `TaskStatus` | `"Pending"`, `"Executed"`, `"PartiallyExecuted"`, `"Cancelled"`, `"Postponed"` |

A comparação é **sensível a maiúsculas e minúsculas**: `"college"` é rejeitado.
Qualquer JSON que não seja string (número, `null`, objeto) também é rejeitado.

```jsonc
{ "category": "PersonalProjects", "priority": "High" }
```

Funções:

```cpp
nlohmann::json to_json(domain::Category value);
domain::Category category_from_json(const nlohmann::json& value);
// ... e o par equivalente para cada enum da tabela.
```

## `Date`

String **ISO 8601**, no formato `YYYY-MM-DD`, sempre com zero à esquerda.

```jsonc
{ "date": "2026-03-05" }
```

- O formato é estrito: `"2026-3-5"` é rejeitado, assim como qualquer sufixo de
  hora ou fuso.
- `"05/03/2026"` também é rejeitado. Esse é o formato de `Date::to_string()`,
  que existe para **exibição** e não faz parte do contrato da API.
- A data precisa existir no calendário: `"2026-02-30"` é rejeitado, e
  `"2024-02-29"` é aceito porque 2024 é bissexto.

Funções:

```cpp
nlohmann::json to_json(const domain::Date& value);
domain::Date date_from_json(const nlohmann::json& value);
```

## `TimeSlot`

Objeto com `start` e `end`, ambos **inteiros de minutos contados a partir da
meia-noite** do mesmo dia.

```jsonc
{ "time_slot": { "start": 540, "end": 600 } }   // 09:00 às 10:00
```

- Os dois campos são obrigatórios e precisam ser inteiros; `"540"` como string é
  rejeitado.
- Valem as invariantes de `TimeSlot`: `start >= 0`, `end <= 1440` e
  `end > start`. O intervalo é semiaberto `[start, end)` — ver
  [date-timeslot-contract.md](date-timeslot-contract.md).

Funções:

```cpp
nlohmann::json to_json(const domain::TimeSlot& value);
domain::TimeSlot time_slot_from_json(const nlohmann::json& value);
```

## Exemplo de uso em uma entidade

Este é o padrão que P-29.1 a P-29.4 devem seguir:

```cpp
#include "virtual_planner/api/json/shared_json.hpp"

namespace vpj = virtual_planner::api::json;

nlohmann::json body;
body["category"] = vpj::to_json(reminder.category());
body["date"] = vpj::to_json(reminder.date());
body["time_slot"] = vpj::to_json(reminder.time_slot());

const auto category = vpj::category_from_json(body.at("category"));
const auto date = vpj::date_from_json(body.at("date"));
const auto time_slot = vpj::time_slot_from_json(body.at("time_slot"));
```
