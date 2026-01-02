/* eslint-disable react-x/no-array-index-key */
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import type { Station } from '../models/Station';
import LineColorIcon from './LineColorIcon';

interface Props {
  station: Station;
}

function StationCard(props: Props) {
  const { station } = props;
  return <Card>
    <Card.Header>{station.name}</Card.Header>
    <Card.Body>
      <Container>
        {station.trains.map((train, index) => (
          <Row key={index}>
            <Col>
              <div className="d-flex align-items-center gap-1">
                <LineColorIcon colors={train.lineColors} />{train.headSign}
              </div>
            </Col>
            <Col xs="auto" className="text-end">{train.arrivalTimeMessage}</Col>
          </Row>
        ))}
      </Container>
    </Card.Body>
  </Card>;
}

export default StationCard;