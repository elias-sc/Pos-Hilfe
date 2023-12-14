var axios = require('axios');
var qs = require('qs');
const db = require('./database');

async function getCode(code){
    const data = qs.stringify({
        'code': code,
        'language': 'java',
        'input': ''
    });
    
    const config = {
        method: 'post',
        url: 'https://codex-api.fly.dev/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    try {
        const response = await axios(config);
        const body = JSON.parse(JSON.stringify(response.data));
        return body;
    } catch (error) {
        const body = JSON.parse(JSON.stringify(error.response.data));
        console.log("error: ", body);
        return body;
    }
}

async function getExercise(id) {
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM exercises WHERE id = ?', [id]);
    connection.release();
    return rows;
}

async function getTests(exercise_id) {
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM tests WHERE exercise_id = ?', [exercise_id]);
    connection.release();
    return rows;
}

async function getAmountOfExercises(){
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM exercises');
    connection.release();
    return rows.length;
}


module.exports = { getCode, getExercise, getTests, getAmountOfExercises}