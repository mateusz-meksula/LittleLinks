from functools import cache

from classyenv import ClassyEnv, EnvVar


class Config(ClassyEnv):
    secret_key: str = EnvVar("SECRET_KEY")
    db_host = EnvVar("DB_HOST")
    db_port = EnvVar("DB_PORT", converter=int)
    db_user = EnvVar("DB_USER")
    db_password = EnvVar("DB_PASSWORD")
    db_name = EnvVar("DB_NAME")


@cache
def _get_config():
    return Config()


def get_config():
    yield _get_config()
