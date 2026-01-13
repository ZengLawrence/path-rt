import { InputGroup } from 'react-bootstrap';
import { ArrowDown, ArrowDownUp } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

interface Station {
  key: string;
  name: string;
}

interface StationSelectProps {
  stations: Station[];
  selected: string;
  label: string;
  onChange: (key: string) => void;
}

const StationSelect = (props: StationSelectProps) => {
  return (
    <InputGroup>
      <InputGroup.Text>{props.label}</InputGroup.Text>
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
    </InputGroup>
  );
}

interface Props {
  stations: Station[];
  selected: { key1: string; key2: string; lockDirection?: boolean; };
  onChange: (selected: { key1: string; key2: string; lockDirection?: boolean; }) => void;
}

const SelectTripForm = (props: Props) => {
  const { key1, key2, lockDirection } = props.selected;

  const handleStation1Change = (key: string) => {
    props.onChange({ key1: key, key2, lockDirection });
  };

  const handleStation2Change = (key: string) => {
    props.onChange({ key1, key2: key, lockDirection });
  };

  const handleLockDirectionChange = (val: boolean) => {
    props.onChange({ key1, key2, lockDirection: val });
  }

  return (
    <Form>
      <Form.Group id="trip-select">
        <Row><Form.Text>Select your trip:</Form.Text></Row>
        <Row>
          <Col>
            <Row>
              <StationSelect
                stations={props.stations}
                selected={key1}
                label="Station 1"
                onChange={handleStation1Change}
              />
            </Row>
            <Row className="p-1">
              {lockDirection ? <ArrowDown /> : <ArrowDownUp />}
            </Row>
            <Row>
              <StationSelect
                stations={props.stations}
                selected={key2}
                label="Station 2"
                onChange={handleStation2Change} />
            </Row>
          </Col>
        </Row>
      </Form.Group>
      <Form.Check
        type="switch"
        id="check-lock-direction"
        label="lock direction - station 1 to station 2"
        checked={lockDirection}
        onChange={e => { handleLockDirectionChange(e.target.checked); }}
      />
    </Form>
  );
};

export default SelectTripForm;