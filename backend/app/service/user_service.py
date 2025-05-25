from app.models.user import UserCreate, UserOutput
from sqlalchemy import Connection, text


class UserService:
    # TODO: fix
    #       THis results in a funky error.
    @staticmethod
    def create_user(conn: Connection, new_user: UserCreate) -> UserOutput:
        result = conn.execute(
            text("""
                INSERT INTO users 
                VALUES (:first_name, :last_name, :email) 
                RETURNING id, first_name, last_name, email, created_at, updated_at;
            """),
            {
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "email": new_user.email,
            },
        )

        result = result.fetchone()
        if result is None:
            raise Exception("Failed to create user")
        result = UserOutput(**dict(result))

        return result

    # @staticmethod
    # def get_all_users(conn: Connection):
    #     result = conn.execute(
    #         text("""
    #             SELECT first_name, last_name, created_at, updated_at
    #             FROM users;
    #         """)
    #     )
