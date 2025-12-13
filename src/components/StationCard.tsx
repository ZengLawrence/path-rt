/* eslint-disable react-x/no-array-index-key */
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import type { Station } from '../models/Station';

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
            <Col>{train.headSign}</Col>
            <Col className="text-end">{train.arrivalTimeMessage}</Col>
          </Row>
        ))}
      </Container>
    </Card.Body>
  </Card>;
}

export default StationCard;