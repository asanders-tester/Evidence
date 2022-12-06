/**
 * This is a utility page that will query 
 */


import { Client } from 'pg';
import * as environment from '../../environment.json';

export class UserQuery {
  /** Connect to the database and then send the given query. Retrieve the response to be used for validations. */
  async profileInfo(id: number) {
    let query = [];
    
    const config = {
      user: environment['user'],
      host: environment['host'],
      database: environment['database'],
      password: environment['password'],
      port: environment['port']
    };

    const client = new Client(config);

    return new Promise(function(resolve, reject) {
      client.connect(function(err) {
        if(err) {
          console.log(err);
          client.end();
        }
      
        client.query(`SELECT * FROM profiles p WHERE id = '${id}'`, function(err, result) {
          if(err) {
            return console.error('Error running query ', err);
          }

          client.end();
          const row = result.rows;
          query = row;
          resolve(query);
        });
      });
    });
  }

  /** Connect to the database and then send the given query. Retrieve the response to be used for validations. */
  async surveyResults(id: number) {
    let query = [];

    const config = {
      user: environment['user'],
      host: environment['host'],
      database: environment['database'],
      password: environment['password'],
      port: environment['port']
    };

    const client = new Client(config);

    return new Promise(function(resolve, reject) {
      client.connect(function(err) {
        if(err) {
          console.log(err);
          client.end();
        }
      
        client.query(`SELECT * FROM smart_select_surveys sss WHERE user_id = '${id}'`, function(err, result) {
          if(err) {
            return console.error('Error running query ', err);
          }

          client.end();
          const row = result.rows;
          query = row;
          resolve(query);
        });
      });
    });
  }
}