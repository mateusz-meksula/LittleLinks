import subprocess
import sys
import time
from typing import Literal

from commons import DB_NAME, DB_PASSWORD, DB_PORT

CONTAINER_NAME = "little_links_test_db"
MYSQL_VERSION = 8.4


def main():
    option: Literal["start", "stop"]
    if len(sys.argv) == 1:
        option = "start"
    else:
        provided_option = sys.argv[1]
        if provided_option not in ("start", "stop"):
            raise ValueError
        option = provided_option

    if option == "start":
        spawn_database_container()
    else:
        stop_database_container()


def spawn_database_container():
    command = [
        "docker run",
        "-d",
        f"-p {DB_PORT}:3306",
        f"--env MYSQL_ROOT_PASSWORD={DB_PASSWORD}",
        f"--env MYSQL_DATABASE={DB_NAME}",
        f"--name {CONTAINER_NAME}",
        "--volume ./database/test_dbdata:/var/lib/mysql",
        f"mysql:{MYSQL_VERSION}",
    ]
    run_command(command)

    while True:
        r = run_command(
            f"docker exec {CONTAINER_NAME} mysqladmin -proot ping",
            silent=True,
            suppress=True,
        )
        if "mysqld is alive" in r.stdout:
            print_green(
                "\nDatabase server is running and database have been initialized."
            )
            break
        else:
            time.sleep(1)


def stop_database_container():
    run_command(f"docker stop {CONTAINER_NAME}")
    time.sleep(1)
    run_command(f"docker remove {CONTAINER_NAME}")


def run_command(
    command: str | list[str], *, silent: bool = False, suppress: bool = False
):
    if isinstance(command, list):
        command = " ".join(command)

    if not silent:
        print(f"\nRunning the following command:")
        print_blue(command)

    r = subprocess.run(command, shell=True, capture_output=True, text=True)

    if r.returncode == 0:
        if not silent:
            print_green("Command executed successfully")
    else:
        if not silent:
            print_red("ERROR")
            print(r.stderr)
        if not suppress:
            raise SystemExit()

    return r


def print_green(skk):
    print("\033[92m{}\033[00m".format(skk))


def print_red(skk):
    print("\033[91m{}\033[00m".format(skk))


def print_blue(skk):
    print("\033[34m{}\033[00m".format(skk))


if __name__ == "__main__":
    main()
