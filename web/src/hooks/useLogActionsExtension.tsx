import { Action, Alert, ExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { ListIcon } from '@patternfly/react-icons';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listGoals } from '../korrel8r-client';

type LogActionsExtensionOptions = {
  alert?: Alert;
};

const useLogActionsExtension: ExtensionHook<Array<Action>, LogActionsExtensionOptions> = (
  options,
) => {
  const { t } = useTranslation('plugin__logging-view-plugin');
  const [action, setAction] = React.useState<Action | null>(null);

  useEffect(() => {
    const alertingRuleName = options.alert?.rule.name;

    if (alertingRuleName) {
      const { request, abort } = listGoals({
        goalsRequest: {
          start: { class: 'Alert.k8s', queries: [{ kind: 'Alert', name: alertingRuleName }] },
          goals: ['log/application', 'log/infrastructure', 'log/audit'],
        },
      });

      request().then((response) => {
        const firstGoalQuery = response
          .flatMap((node) => (node !== undefined && node.queries !== undefined ? node.queries : []))
          .find((query) => !!query);

        if (firstGoalQuery) {
          const href = `/monitoring/logs?q=${firstGoalQuery}`;

          setAction({
            id: 'link-to-logs',
            label: (
              <>
                <ListIcon /> {t('See related logs')}
              </>
            ),
            cta: { href },
          });
        }
      });

      return () => {
        abort();
      };
    }
  }, [options.alert]);

  return [action ? [action] : [], true, null];
};

export default useLogActionsExtension;
