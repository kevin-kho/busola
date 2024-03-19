// Get object

// usePrepareDetailsProps

// useGet(usePrepareDetailsProps.resourceUrl)

import { usePrepareDetailsProps } from '../resources/helpers';
import { useGetCRbyPath } from '../components/Extensibility/useGetCRbyPath';
import { getExtensibilityPath } from '../components/Extensibility/helpers/getExtensibilityPath';
import pluralize from 'pluralize';
import { useParams } from 'react-router-dom';
import { useGet } from '../shared/hooks/BackendAPI/useGet';

export const getCustomResource = () => {
  // eslint-disable-next-line
  const { namespaceId, resourceName } = useParams();

  // eslint-disable-next-line
  const resMetaData = useGetCRbyPath();

  // eslint-disable-next-line
  const { urlPath, resource, features } = resMetaData?.general ?? {};

  // eslint-disable-next-line
  const preparedDetailsProps = usePrepareDetailsProps({
    resourceCustomType: getExtensibilityPath(resMetaData?.general),
    resourceType: pluralize(resource?.kind),
    resourceI18Key: 'name',
    apiGroup: resource?.group,
    apiVersion: resource?.version,
    customResourceName: resourceName,
    customNamespaceId: namespaceId,
  });

  // eslint-disable-next-line
  return useGet(preparedDetailsProps.resourceUrl);
};
