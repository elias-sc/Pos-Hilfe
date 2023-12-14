const db = require('./database');
const bcrypt = require("bcrypt");

async function createAccount(data) {
    const connection = await db.getConnection();
    const { username, email, password } = data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?);", [username, email, hashedPassword]);

        const databaseResult = await connection.execute("SELECT * FROM users WHERE email = ? OR username = ?;", [email, username]);
        const user = JSON.parse(JSON.stringify(databaseResult))[0][0];
        connection.release();
        return user;
    } catch (error){
        connection.release();
        throw new Error(error.sqlMessage);
    }
}

async function login(data){
    const connection = await db.getConnection();
    const {username, password} = data;

    try {
        const databaseResult = await connection.execute("SELECT * FROM users WHERE email = ? OR username = ?;", [username, username]);
        const user = JSON.parse(JSON.stringify(databaseResult))[0][0];

        // Check if the user exists
        if (!user) {
            connection.release();
            throw new Error('Invalid credentials');
        }

        // Compare the entered password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            connection.release();
            return user;
        } else {
            connection.release();
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        connection.release();
        throw new Error(error);
    }
}

async function storeCompletedExercise(userId, exerciseId){
    const connection = await db.getConnection();
    await connection.execute("INSERT INTO user_exercises (user_id, exercise_id) VALUES (?, ?);", [userId, exerciseId]);
    connection.release();
}

async function getCompletedExercises(userId){
    const connection = await db.getConnection();
    const databaseResult = await connection.execute("SELECT exercise_id FROM user_exercises WHERE user_id = ?;", [userId]);
    connection.release();

    result = databaseResult[0].map((exercise) => exercise.exercise_id);
    return result;
}


module.exports = {createAccount, login, storeCompletedExercise, getCompletedExercises};