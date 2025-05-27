from app.schemas.user import UserCreate, UserOutput
from sqlalchemy import Connection, text


class UserService:
    @staticmethod
    def create_user(conn: Connection, new_user: UserCreate) -> UserOutput:
        sql = text("""
            INSERT INTO users (first_name, last_name, email)
            VALUES (:first_name, :last_name, :email)
            RETURNING id, first_name, last_name, email, created_at, updated_at;
        """)
        with conn.begin():
            result = conn.execute(
                sql,
                new_user.model_dump(),
            )

            result = result.mappings().first()
            if result is None:
                raise Exception("Failed to create user")
            result = UserOutput(**result)

            return result

    # @staticmethod
    # def get_all_users(conn: Connection):
    #     result = conn.execute(
    #         text("""
    #             SELECT first_name, last_name, created_at, updated_at
    #             FROM users;
    #         """)
    #     )
