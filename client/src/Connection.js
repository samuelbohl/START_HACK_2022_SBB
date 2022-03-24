import './App.css';
// import { useState, useEffect } from 'react';
import {Slider,  Row, Col, Button} from 'antd';

import { Line } from '@ant-design/plots';

// async function getLeisureScore(timestamp, uid) {
//     // Default options are marked with *
//     const response = await fetch('https://weather.api.sbb.ch/' + timestamp + '/leisure_biking:idx/' + uid + '/json', {
//       method: 'GET', // *GET, POST, PUT, DELETE, etc.
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOMDhQek52bDdqNGFfSlBmZ0FlZFNYTHNjcmprbmZ4OXppR2hxcHN1dkt3In0.eyJleHAiOjE2NDgxMjc5MzQsImlhdCI6MTY0ODEyMzQzNCwianRpIjoiZDAyYzFiMjAtZjZmYy00MzZkLWFkMTYtODhmOGM4ZGQxNmNhIiwiaXNzIjoiaHR0cHM6Ly9zc28uc2JiLmNoL2F1dGgvcmVhbG1zL1NCQl9QdWJsaWMiLCJhdWQiOiJhcGltLXdlYXRoZXJfc2VydmljZS1wcm9kLWF3cyIsInN1YiI6IjQ1NGNiMjM5LTZjN2EtNGU3Zi05YzY3LWQ0ZWQyMDAzMzdmYyIsInR5cCI6IkJlYXJlciIsImF6cCI6Ijg1OGY2MzRmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3Blci5zYmIuY2giXSwic2NvcGUiOiJjbGllbnQtaW5mbyBzYmJ1aWQgcHJvZmlsZSBlbWFpbCBTQkIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIyMTcuMTkyLjEwMi4xNCIsImNsaWVudElkIjoiODU4ZjYzNGYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtODU4ZjYzNGYiLCJjbGllbnRBZGRyZXNzIjoiMjE3LjE5Mi4xMDIuMTQiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC04NThmNjM0ZkBwbGFjZWhvbGRlci5vcmcifQ.Byscvn86Pm-GskQfqu9WnwZ06LkzDQgS2DRo8n8fzB-xkmKnHGswoxMIUR6rAj8rxxoicg9mY7eVI2LyCmsK0t1YGxrxvcJeQyOi35sCLOaexwyXIxoN8P1GwmBs1_2wEbTt-NT49B8Bhvl_IXdgSeFUmrz1X2E3r7RvOjW_2rOngX8xeluuQAug2a15SCyT4VAmqLjCg8g03b1LBW_XSgDDXwzHY6QIXp8AZEDlXjc_lFCqeeCFLPCY_dEQu_MSBMdXkxZqmxXD7gSvm2_duDvtun9oKTSp5OtC0E-h8Infk4tA6C-xYZez9QplWqkDAVxvN7Wk122ylhfokQyK0A'
//       }
//     });
//     let data = {};
//     await response.json().then(response => {data = response.data[0].coordinates[0].dates[0].value})
//     return data ; // parses JSON response into native JavaScript objects
// }

function Connection(props) {

    //const test = getLeisureScore('2021-01-02T14:00:00Z', 'didok_8506302').then(data => console.log(data));
    //console.log(test)

    const data = [{time: '2020', value: 1},{time: '2021', value: 0.8},{time: '2022', value: 0.3},{time: '2023', value: 0.1}];

    const config = {
        data,
        xField: 'time',
        yField: 'value',
        smooth: true,
        color: 'red',
    };

    const reservationUrl = 'https://www.sbb.ch/ticketshop/b2c/adw.do?sprache=en&artikelnummer=1966&von=' + props.from + '&nach=' + props.to + '&reiseDatum=' + props.date + '&reiseZeit=' + props.depTime;

  return (
    <Row justify='center' style={{backgroundColor: '#f6f6f6', margin: '5px 30px', padding: 10}}>
        <Col span={6} offset={1} style={{marginTop: 20}}>
            <Row>
                <svg style={{backgroundColor: '27348b', width: 30, height: 30}}>
                    <use href="#SBB_oev_b_t02" backgroundColor="27348b" fill='white'></use>
                </svg>
                <svg style={{backgroundColor: 'eb0000', width: 90, height: 30, marginLeft: 5}}>
                    <use href="#SBB_product_ic-1" fill='white'></use>
                </svg>
            </Row>
            <Row>
                <span style={{fontSize: 18, fontWeight: 700}}>{props.from + ' '}<Slider disabled range defaultValue={[0, 100]}/>{' ' + props.to}</span>
            </Row>
        </Col>
        <Col span={4}><Line width={300} height={100} {... config} /></Col>
        <Col span={4}>Recomended latest reservation time: 09:00</Col>
        <Col span={2}>
            <Button type="primary" href={reservationUrl} target="_blank" style={{backgroundColor: '#eb0000', border: 'none', borderRadius: '.13333em', height: '44px', padding: '0.93333em 2.66667em 1em'}}>Reserve Now</Button>
        </Col>
    </Row>
  );
}

export default Connection;
