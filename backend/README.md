## Backend

1. Install MongoDB from [here](https://www.mongodb.com/try/download/community).

2. Clone the backend repository and navigate to the directory:

   ```sh
   cd backend
   ```

3. Install Poetry:

   ```sh
   pip3 install poetry
   ```

4. Install the backend dependencies:

   ```sh
   poetry install --no-root
   poetry run python app.py
   ```

### Backend Configuration

| Key           | Value                   |
| ------------- | ----------------------- |
| python        | ^3.12                   |
| flask         | ^3.0.3                  |
| flask-pymongo | ^2.3.0                  |
| flask-cors    | ^4.0.1                  |
| mongoengine   | ^0.28.2                 |
| pymongo       | ^4.8.0                  |
| requires      | poetry-core             |
| build-backend | poetry.core.masonry.api |
