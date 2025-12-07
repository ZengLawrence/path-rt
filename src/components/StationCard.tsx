import Card from 'react-bootstrap/Card';

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
      {props.trains.map((train, index) => (
        <Card.Text key={index}>
          <span>{train.headSign}</span>&nbsp;<span>{train.arrivalTimeMessage}</span>
        </Card.Text>
      ))}
    </Card.Body>
  </Card>;
}

export default StationCard;