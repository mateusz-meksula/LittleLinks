from functools import cache

from classyenv import ClassyEnv, EnvVar


class Config(ClassyEnv):
    secret_key: str = EnvVar("SECRET_KEY")
    refresh_secret_key: str = EnvVar("REFRESH_SECRET_KEY")
    db_host: str = EnvVar("DB_HOST")
    db_port: int = EnvVar("DB_PORT", converter=int)
    db_user: str = EnvVar("DB_USER")
    db_password: str = EnvVar("DB_PASSWORD")
    db_name: str = EnvVar("DB_NAME")


@cache
def _get_config():
    return Config()


def get_config():
    yield _get_config()
