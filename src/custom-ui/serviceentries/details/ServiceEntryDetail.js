import { getCustomResource } from '../../helper';
import '@ui5/webcomponents/dist/Badge.js';

const ServiceEntryDetails = () => {
  const customResource = getCustomResource();

  const addressList = customResource?.data?.spec?.addresses?.map(addr => {
    return <ui5-li>{addr}</ui5-li>;
  });

  const hosts = customResource?.data?.spec?.hosts?.map(x => {
    return <ui5-li>{x}</ui5-li>;
  });

  return (
    <div style={{ color: 'white' }}>
      <p>ServiceEntryDetails</p>
      <div>
        Location:{' '}
        <ui5-badge color-scheme="6">
          {customResource?.data?.spec?.location}
        </ui5-badge>
      </div>
      <div>
        Resolution:{' '}
        <ui5-badge color-scheme="5">
          {customResource?.data?.spec?.resolution}
        </ui5-badge>
      </div>

      <div>
        Addresses
        <ui5-list data-sap-ui-fastnavgroup="true">{addressList}</ui5-list>
      </div>

      <div>
        Hosts
        <ui5-list data-sap-ui-fastnavgroup="true">{hosts}</ui5-list>
      </div>
    </div>
  );
};

export default ServiceEntryDetails;
