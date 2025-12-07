import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface Props {
  name: string;
  trains: Array<{
    headSign: string;
    arrivalTimeMessage: string;
  }>;
}

function StationCard(props: Props) {
  return <Card>
    <Card.Header>{props.name}</Card.Header>
    <Card.Body>
      <Container>
        {props.trains.map((train, index) => (
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