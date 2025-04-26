'use strict'
const sqlite = require('sqlite3');
// open the database
const db = new sqlite.Database('films_users.db', (err) => {
    if (err) throw err;
});

const crypto = require('crypto')

exports.getUserById = (id) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * FROM users WHERE id=?';
        db.get(sql,[id],(err,row)=>{
            if(err){
                reject(err);
            }else if (row===undefined){
                resolve({error:'User not found.'})
            }else{
                const usr = {id:row.id, email: row.email, name: row.email};
                resolve(usr);
            }

        });

    });
}

exports.getUser = (email,pass) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * FROM users WHERE email=?';
        db.get(sql,[email],(err,row)=>{
            if(err){
                reject(err);
            }else if(!row){
                resolve(false);
            }
            else{
                crypto.scrypt(pass,row.salt,32,function(err,hashPass){
                    if(err){reject(err);}
                    if(!crypto.timingSafeEqual(Buffer.from(row.hash,'hex'),hashPass)){resolve(false);}
                    else{
                        resolve({id: row.id, email: row.email, name: row.email});
                    }
                })
            }
        })
    })
}

