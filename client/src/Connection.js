import './App.css';
// import { useState, useEffect } from 'react';
import {Slider,  Row, Col} from 'antd';

async function getLeisureScore(timestamp, uid) {
    // Default options are marked with *
    const response = await fetch('https://weather.api.sbb.ch/' + timestamp + '/leisure_biking:idx/' + uid + '/json', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOMDhQek52bDdqNGFfSlBmZ0FlZFNYTHNjcmprbmZ4OXppR2hxcHN1dkt3In0.eyJleHAiOjE2NDgxMjc5MzQsImlhdCI6MTY0ODEyMzQzNCwianRpIjoiZDAyYzFiMjAtZjZmYy00MzZkLWFkMTYtODhmOGM4ZGQxNmNhIiwiaXNzIjoiaHR0cHM6Ly9zc28uc2JiLmNoL2F1dGgvcmVhbG1zL1NCQl9QdWJsaWMiLCJhdWQiOiJhcGltLXdlYXRoZXJfc2VydmljZS1wcm9kLWF3cyIsInN1YiI6IjQ1NGNiMjM5LTZjN2EtNGU3Zi05YzY3LWQ0ZWQyMDAzMzdmYyIsInR5cCI6IkJlYXJlciIsImF6cCI6Ijg1OGY2MzRmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3Blci5zYmIuY2giXSwic2NvcGUiOiJjbGllbnQtaW5mbyBzYmJ1aWQgcHJvZmlsZSBlbWFpbCBTQkIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIyMTcuMTkyLjEwMi4xNCIsImNsaWVudElkIjoiODU4ZjYzNGYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtODU4ZjYzNGYiLCJjbGllbnRBZGRyZXNzIjoiMjE3LjE5Mi4xMDIuMTQiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC04NThmNjM0ZkBwbGFjZWhvbGRlci5vcmcifQ.Byscvn86Pm-GskQfqu9WnwZ06LkzDQgS2DRo8n8fzB-xkmKnHGswoxMIUR6rAj8rxxoicg9mY7eVI2LyCmsK0t1YGxrxvcJeQyOi35sCLOaexwyXIxoN8P1GwmBs1_2wEbTt-NT49B8Bhvl_IXdgSeFUmrz1X2E3r7RvOjW_2rOngX8xeluuQAug2a15SCyT4VAmqLjCg8g03b1LBW_XSgDDXwzHY6QIXp8AZEDlXjc_lFCqeeCFLPCY_dEQu_MSBMdXkxZqmxXD7gSvm2_duDvtun9oKTSp5OtC0E-h8Infk4tA6C-xYZez9QplWqkDAVxvN7Wk122ylhfokQyK0A'
      }
    });
    let data = {};
    await response.json().then(response => {data = response.data[0].coordinates[0].dates[0].value})
    return data ; // parses JSON response into native JavaScript objects
}

function Connection(props) {

    const test = getLeisureScore('2021-01-02T14:00:00Z', 'didok_8506302').then(data => console.log(data));
    console.log(test)

  return (
    <Row>
        <Col span={6} offset={1}><span>{props.from + ' '}<Slider disabled range defaultValue={[0, 100]}/>{' ' + props.to}</span></Col>
        <Col span={4}>{}</Col>
    </Row>
  );
}

export default Connection;
