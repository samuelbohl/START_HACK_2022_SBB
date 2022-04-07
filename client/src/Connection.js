import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Slider,  Row, Col, Button} from 'antd';
import moment from 'moment';
import { Line } from '@ant-design/plots';
import ReactLoading from 'react-loading';


function Connection(props) {


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recomendation, setRecomendation] = useState('Last Minute');

    useEffect(() => {
        axios.get('http://localhost:8000/prob/' + props.trainNum + '/' + props.fromId + '/' + props.toId + '/' + moment(props.date).format("YYYY-MM-DD") + '/1', {mode: 'no-cors'})
        .then(res => {
            setData(() => res.data.map((el) => ({...el, delta: el.delta/60000})))
            setLoading(() => false)

            res.data.some((dataPoint, index) => {
                if(dataPoint.prob > 0.65) {
                    let departureTimeAndDateMoment = moment(moment(props.date).format("YYYY-MM-DD") + ' ' + props.depTime)
                    departureTimeAndDateMoment.subtract(moment.duration(-1 * dataPoint.delta))

                    if(index != 0) {
                        setRecomendation(() => departureTimeAndDateMoment.format("HH:mm DD.MM.YYYY"))
                    } else {
                        setRecomendation(() => 'ASAP')
                    }
                    return true;
                }
                return false;
            })

            if(res.data.length <= 1) {
                setRecomendation(() => 'No Data')
            }
        })
    }, [])

    const config = {
        data,
        xField: 'delta',
        yField: 'prob',
        smooth: true,
        color: 'red',
    };

    const date = moment(props.date).format("DD.MM.YYYY");

    const reservationUrl = 'https://www.sbb.ch/ticketshop/b2c/adw.do?sprache=en&artikelnummer=1966&von=' + props.from + '&nach=' + props.to + '&reiseDatum=' + date + '&reiseZeit=' + props.depTime;

  return (
    <Row justify='center' style={{backgroundColor: '#f6f6f6', margin: '5px 30px', padding: 10}}>
        <Col span={6} offset={1} style={{marginTop: 20}}>
            <Row>
                <svg style={{backgroundColor: '#27348b', width: 30, height: 30}}>
                    <use href="#SBB_oev_b_t02" backgroundColor="27348b" fill='white'></use>
                </svg>
                <svg style={{backgroundColor: '#eb0000', width: 90, height: 30, marginLeft: 5}}>
                    <use href={"#SBB_product_" + props.trainName} fill='white'></use>
                </svg>
            </Row>
            <Row>
                <span style={{fontSize: 18, fontWeight: 700}}>{props.depTime + ' '}<Slider disabled range defaultValue={[0, 100]}/>{' ' + props.arrTime}</span>
            </Row>
        </Col>
        <Col span={4} style={{width: 300}}>
            {loading &&
                <ReactLoading type={'spin'} color={'#eb0000'} height={80} width={80} />
            }
            {!loading &&
                <Line width={300} height={100} {... config} />
            }
        </Col>
        <Col span={4} style={{fontSize: 16, textAlign: 'center', paddingTop: 28}}>
            Recomended latest reservation time: {recomendation}
        </Col>
        <Col span={2} style={{paddingTop: 32}}>
            <Button type="primary" href={reservationUrl} target="_blank" style={{backgroundColor: '#eb0000', border: 'none', borderRadius: '.13333em', height: '44px', padding: '1em 2.66667em 1em'}}>Reserve Now</Button>
        </Col>
    </Row>
  );
}

export default Connection;
