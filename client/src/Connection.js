import './App.css';
// import { useState, useEffect } from 'react';
import {Slider,  Row, Col, Button} from 'antd';
import moment from 'moment';
import { Line } from '@ant-design/plots';


function Connection(props) {


    const data = [{time: '2020', value: 1},{time: '2021', value: 0.8},{time: '2022', value: 0.3},{time: '2023', value: 0.1}];

    const config = {
        data,
        xField: 'time',
        yField: 'value',
        smooth: true,
        color: 'red',
    };

    const date = moment(props.date).format("DD.MM.YYYY");

    const reservationUrl = 'https://www.sbb.ch/ticketshop/b2c/adw.do?sprache=en&artikelnummer=1966&von=' + props.from + '&nach=' + props.to + '&reiseDatum=' + date + '&reiseZeit=' + props.depTime;

  return (
    <Row justify='center' style={{backgroundColor: '#f6f6f6', margin: '5px 30px', padding: 10}}>
        <Col span={6} offset={1} style={{marginTop: 20}}>
            <Row>
                <svg style={{backgroundColor: '27348b', width: 30, height: 30}}>
                    <use href="#SBB_oev_b_t02" backgroundColor="27348b" fill='white'></use>
                </svg>
                <svg style={{backgroundColor: 'eb0000', width: 90, height: 30, marginLeft: 5}}>
                    <use href={"#SBB_product_" + props.trainName} fill='white'></use>
                </svg>
            </Row>
            <Row>
                <span style={{fontSize: 18, fontWeight: 700}}>{props.depTime + ' '}<Slider disabled range defaultValue={[0, 100]}/>{' ' + props.arrTime}</span>
            </Row>
        </Col>
        <Col span={4}><Line width={300} height={100} {... config} /></Col>
        <Col span={4} style={{fontSize: 16, textAlign: 'center', paddingTop: 28}}>Recomended latest reservation time: 09:00</Col>
        <Col span={2} style={{paddingTop: 32}}>
            <Button type="primary" href={reservationUrl} target="_blank" style={{backgroundColor: '#eb0000', border: 'none', borderRadius: '.13333em', height: '44px', padding: '1em 2.66667em 1em'}}>Reserve Now</Button>
        </Col>
    </Row>
  );
}

export default Connection;
