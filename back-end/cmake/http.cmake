# Dependencia HTTP decidida na ADR-003 (issue #13 / P-27): cpp-httplib (MIT),
# header-only. O JSON vem de cmake/json.cmake, incluido antes deste modulo.
#
# A opcao VIRTUAL_PLANNER_WITH_HTTP e declarada em CMakeLists.txt, junto das
# demais, e esta desligada por padrao para que o build sem rede continue
# funcionando: com ela OFF nenhum FetchContent_Declare e avaliado e nenhum
# download e tentado.

if(VIRTUAL_PLANNER_WITH_HTTP)
  include(FetchContent)

  # O PoC nao usa TLS nem compressao; desligar evita exigir OpenSSL, zlib e
  # Brotli instalados na maquina.
  set(HTTPLIB_REQUIRE_OPENSSL OFF CACHE BOOL "" FORCE)
  set(HTTPLIB_REQUIRE_ZLIB OFF CACHE BOOL "" FORCE)
  set(HTTPLIB_REQUIRE_BROTLI OFF CACHE BOOL "" FORCE)

  FetchContent_Declare(httplib
    GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
    GIT_TAG v0.53.1
    GIT_SHALLOW TRUE
  )

  FetchContent_MakeAvailable(httplib)

  # PoC de um unico endpoint. Nao entra no build padrao nem no CTest: existe
  # so para provar que a decisao da ADR-003 compila.
  add_executable(virtual_planner_health_poc
    ${VIRTUAL_PLANNER_SOURCE_DIR}/api/health_poc.cpp
  )

  target_link_libraries(virtual_planner_health_poc
    PRIVATE
      httplib::httplib
      nlohmann_json::nlohmann_json
  )

  virtual_planner_enable_warnings(virtual_planner_health_poc)
endif()
