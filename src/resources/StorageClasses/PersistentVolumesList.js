import React from 'react';

import PersistentVolumesListComponent from 'resources/PersistentVolumes/PersistentVolumeList';

export function PersistentVolumesList(storageclass) {
  const params = {
    disableCreate: true,
    disableHiding: true,
    displayArrow: false,
    hasDetailsView: true,
    resourceUrl: `/api/v1/persistentvolumes`,
    resourceType: 'PersistentVolumes',
    isCompact: true,
    showTitle: true,
    filter: persistentvolumes =>
      persistentvolumes.spec.storageClassName === storageclass.metadata.name,
  };

  return (
    <PersistentVolumesListComponent key="persistent-volumes-list" {...params} />
  );
}
