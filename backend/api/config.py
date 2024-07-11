from functools import cache

from classyenv import ClassyEnv, EnvVar


class Config(ClassyEnv):
    secret_key: str = EnvVar("SECRET_KEY")


@cache
def _get_config():
    return Config()


def get_config():
    yield _get_config()
