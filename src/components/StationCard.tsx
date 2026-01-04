/* eslint-disable react-x/no-array-index-key */
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import LineColorIcon from './LineColorIcon';

interface Train {
  headSign: string;
  arrivalTimeMessage: string;
  lineColors: string[];
  transferStation?: string;
}

interface Station {
  name: string;
  trains: Train[];
}

export interface StationCardProps {
  station: Station;
}

function StationCard(props: StationCardProps) {
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
              {train.transferStation
                && <div className="text-muted">xfer {train.transferStation}</div>}
            </Col>
            <Col xs="auto" className="text-end">{train.arrivalTimeMessage}</Col>
          </Row>
        ))}
      </Container>
    </Card.Body>
  </Card>;
}

export default StationCard;