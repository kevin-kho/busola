import ApiGatewayDetails from './apigateways/details/ApiGatewayDetail';
import ApiGatewayList from './apigateways/list/ApiGatewayList';
import ServiceEntryDetails from './serviceentries/details/ServiceEntryDetail';
import ServiceEntryList from './serviceentries/list/ServiceEntryList';

export const selectList = name => {
  switch (name) {
    case 'serviceentries':
      console.log('Return Custom SeviceEntry List');
      return <ServiceEntryList></ServiceEntryList>;

    case 'apigateways':
      console.log('Return Custom ApiGateways List');
      return <ApiGatewayList></ApiGatewayList>;

    default:
      // Will error. Maybe have it return the non-custom list?
      break;
  }
};

export const selectDetails = name => {
  switch (name) {
    case 'serviceentries':
      console.log('Return Custom ServiceEntry Details');
      return <ServiceEntryDetails></ServiceEntryDetails>;

    case 'apigateways':
      console.log('Return Custom ApiGateways Details');
      return <ApiGatewayDetails></ApiGatewayDetails>;

    default:
      // Will error. Maybe have it return the non-custom details?
      break;
  }
};
