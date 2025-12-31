import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

interface Station {
  key: string;
  name: string;
}

interface StationSelectProps {
  stations: Station[];
  selected: string;
  onChange: (key: string) => void;
}

const StationSelect = (props: StationSelectProps) => {
  return (
    <Form.Select
      aria-label="Select your station"
      defaultValue={props.selected}
      onChange={(e) => { props.onChange(e.target.value); }}
    >
      {props.stations.map((station) => (
        <option
          key={station.key}
          value={station.key}
        >
          {station.name}
        </option>
      ))}
    </Form.Select>
  );
}

interface Props {
  stations: Station[];
  selected: { key1: string; key2: string; };
  onChange: (selected: { key1: string; key2: string; }) => void;
}

const TripSelect = (props: Props) => {

  const handleStation1Change = (key: string) => {
    props.onChange({ key1: key, key2: props.selected.key2 });
  };
  
  const handleStation2Change = (key: string) => {
    props.onChange({ key1: props.selected.key1, key2: key });
  };

  return (
    <Form>
      <Row><Form.Text>Select your trip:</Form.Text></Row>
      <Row>
        <Col><StationSelect stations={props.stations} selected={props.selected.key1} onChange={handleStation1Change} /></Col>
        <Col xs="auto"><Form.Text className="text-center">to</Form.Text></Col>
        <Col><StationSelect stations={props.stations} selected={props.selected.key2} onChange={handleStation2Change} /></Col>
      </Row>
    </Form>
  );
};

export default TripSelect;