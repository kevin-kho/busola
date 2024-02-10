import ApiGatewayDetails from './apigateways/details/ApiGatewayDetail';
import ApiGatewayList from './apigateways/list/ApiGatewayList';
import ServiceEntryDetails from './serviceentries/details/ServiceEntryDetail';
import ServiceEntryList from './serviceentries/list/ServiceEntryList';

export const selectList = name => {
  switch (name) {
    case 'serviceentries':
      return <ServiceEntryList></ServiceEntryList>;

    case 'apigateways':
      return <ApiGatewayList></ApiGatewayList>;

    default:
      // Will error. Maybe have it return the non-custom list?
      break;
  }
};

export const selectDetails = name => {
  switch (name) {
    case 'serviceentries':
      return <ServiceEntryDetails></ServiceEntryDetails>;

    case 'apigateways':
      return <ApiGatewayDetails></ApiGatewayDetails>;

    default:
      // Will error. Maybe have it return the non-custom details?
      break;
  }
};
