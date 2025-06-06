import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import jp from 'jsonpath';
import { cloneDeep } from 'lodash';

import * as Inputs from 'shared/ResourceForm/inputs';
import { useGetList } from 'shared/hooks/BackendAPI/useGet';
import { ResourceForm } from 'shared/ResourceForm';
import { ComboboxArrayInput } from 'shared/ResourceForm/fields';
import { useCreateResource } from 'shared/ResourceForm/useCreateResource';
import { createServiceAccountTemplate } from './templates';
import { validateServiceAccount } from './helpers';
import { MessageStrip } from '@ui5/webcomponents-react';
import { useRecoilValue } from 'recoil';
import { columnLayoutState } from 'state/columnLayoutAtom';

const createDefaultSecret = serviceAccountName => {
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    type: 'kubernetes.io/service-account-token',
    metadata: {
      name: `${serviceAccountName}-token`,
      labels: {},
      annotations: {
        'kubernetes.io/service-account.name': serviceAccountName,
      },
    },
    data: {},
  };
};

export default function ServiceAccountCreate({
  formElementRef,
  namespace,
  onChange,
  setCustomValid,
  resource: initialServiceAccount,
  onError,
  onCompleted,
  resourceUrl,
  ...props
}) {
  const { t } = useTranslation();
  const [serviceAccount, setServiceAccount] = useState(
    cloneDeep(initialServiceAccount) || createServiceAccountTemplate(namespace),
  );
  const [initialResource, setInitialResource] = useState(
    initialServiceAccount || createServiceAccountTemplate(namespace),
  );
  const layoutState = useRecoilValue(columnLayoutState);

  useEffect(() => {
    if (layoutState?.showEdit?.resource) return;

    setServiceAccount(
      cloneDeep(initialServiceAccount) ||
        createServiceAccountTemplate(namespace),
    );
    setInitialResource(
      initialServiceAccount || createServiceAccountTemplate(namespace),
    );
  }, [initialServiceAccount, namespace, layoutState?.showEdit?.resource]);

  const isEdit = useMemo(
    () =>
      !!initialResource?.metadata?.name && !!!layoutState?.showCreate?.resource,
    [initialResource, layoutState?.showCreate?.resource],
  );

  const [shouldCreateSecret, setShouldCreateSecret] = useState(false);

  const { data } = useGetList()(`/api/v1/namespaces/${namespace}/secrets`);

  const createSecretResource = useCreateResource({
    singularName: 'Secret',
    pluralKind: 'Secrets',
    resource: createDefaultSecret(serviceAccount.metadata.name),
    createUrl: `/api/v1/namespaces/${serviceAccount.metadata.namespace}/secrets`,
    afterCreatedFn: () => {},
  });

  React.useEffect(() => {
    setCustomValid(validateServiceAccount(serviceAccount));
  }, [serviceAccount, setCustomValid]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = images => {
    const newImages = (images || []).map(image => {
      return { name: image };
    });
    jp.value(serviceAccount, '$.imagePullSecrets', newImages);

    if (!newImages.length) delete serviceAccount.imagePullSecrets;

    setServiceAccount({ ...serviceAccount });
  };

  async function afterServiceAccountCreate(defaultAfterCreateFn) {
    if (isEdit || !shouldCreateSecret) {
      defaultAfterCreateFn();
      return;
    }

    const secretCreationResult = await createSecretResource();
    defaultAfterCreateFn();
    if (secretCreationResult === false) {
      onError(
        'Warning',
        'Your ServiceAccount was created successfully, however Secret creation failed. You have to create it manually later.',
        true,
      );
    } else {
      onCompleted(`ServiceAccount ${serviceAccount.metadata.name} created`);
    }
  }

  return (
    <ResourceForm
      {...props}
      pluralKind="serviceaccounts"
      singularName={t(`service-accounts.name_singular`)}
      resource={serviceAccount}
      setResource={setServiceAccount}
      onChange={onChange}
      formElementRef={formElementRef}
      createUrl={resourceUrl}
      initialResource={initialResource}
      updateInitialResource={setInitialResource}
      afterCreatedFn={afterServiceAccountCreate}
    >
      <ComboboxArrayInput
        title={t('service-accounts.headers.image-pull-secrets')}
        tooltipContent={t(
          'service-accounts.create-modal.tooltips.image-pull-secrets',
        )}
        propertyPath="$.imagePullSecrets"
        setValue={value => handleImageChange(value)}
        toInternal={values => (values || []).map(value => value?.name)}
        options={(data || []).map(i => ({
          key: i.metadata.name,
          text: i.metadata.name,
        }))}
      />
      <ResourceForm.FormField
        label={t('service-accounts.headers.auto-mount-token')}
        tooltipContent={t(
          'service-accounts.create-modal.tooltips.auto-mount-token',
        )}
        input={Inputs.Switch}
        onChange={() => {
          const automountServiceAccountToken = jp.value(
            serviceAccount,
            '$.automountServiceAccountToken',
          );
          jp.value(
            serviceAccount,
            '$.automountServiceAccountToken',
            !automountServiceAccountToken,
          );
          setServiceAccount({ ...serviceAccount });
        }}
        checked={jp.value(serviceAccount, '$.automountServiceAccountToken')}
      />
      <ResourceForm.FormField
        label={t('service-accounts.associated-secret.label')}
        tooltipContent={t(
          t('service-accounts.create-modal.tooltips.associated-secret'),
        )}
        input={Inputs.Switch}
        disabled={isEdit}
        onChange={() =>
          setShouldCreateSecret(shouldCreateSecret => !shouldCreateSecret)
        }
      />
      {shouldCreateSecret && (
        <MessageStrip design="Critical" hideCloseButton>
          {t('service-accounts.associated-secret.warning')}
        </MessageStrip>
      )}
    </ResourceForm>
  );
}
