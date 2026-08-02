# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 (2026-08-02)


### Features

* add embed formatting utilities ([786cc72](https://github.com/klrab3490/janitor-bot/commit/786cc72b124455eda56989c9fd6aecfb191bef69))
* core architecture (config, db adapters, repositories, services, middleware, DI container) ([97d8c98](https://github.com/klrab3490/janitor-bot/commit/97d8c986165bd75dde8a1ddd6598f91e11fab37e))
* Docker deployment (Dockerfile, compose with optional Postgres profile) ([3b01a60](https://github.com/klrab3490/janitor-bot/commit/3b01a60b387cae16c2b13981e25654b5c5babeaf))
* dynamic command loader with all 10 slash commands, event loader ([e5c8eeb](https://github.com/klrab3490/janitor-bot/commit/e5c8eeb18e060a4b96d17e1ea05b0f1308720b81))
* Express API (connect/disconnect/health/version) and bot bootstrap ([39e997c](https://github.com/klrab3490/janitor-bot/commit/39e997c9d086dfe57906bf6321ab54d58adc262d))

## [Unreleased]

### Added

- Initial release: Discord-to-n8n bridge with pairing system, SQLite/Postgres support, encrypted connections, and 10 slash commands (`help`, `ping`, `connect`, `disconnect`, `status`, `cleanup`, `workflow`, `logs`, `server`, `docker`).
