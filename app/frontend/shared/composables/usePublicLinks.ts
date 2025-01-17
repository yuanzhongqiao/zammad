// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { usePublicLinksQuery } from '#shared/entities/public-links/graphql/queries/links.api.ts'
import { PublicLinkUpdatesDocument } from '#shared/entities/public-links/graphql/subscriptions/currentLinks.api.ts'
import {
  EnumPublicLinksScreen,
  type PublicLinkUpdatesSubscriptionVariables,
  type PublicLinkUpdatesSubscription,
  type PublicLinksQuery,
} from '#shared/graphql/types.ts'
import QueryHandler from '#shared/server/apollo/handler/QueryHandler.ts'
import { computed } from 'vue'

export const usePublicLinks = (screen: EnumPublicLinksScreen) => {
  const publicLinksQuery = new QueryHandler(usePublicLinksQuery({ screen }))

  publicLinksQuery.subscribeToMore<
    PublicLinkUpdatesSubscriptionVariables,
    PublicLinkUpdatesSubscription
  >({
    document: PublicLinkUpdatesDocument,
    variables: {
      screen: EnumPublicLinksScreen.Login,
    },
    updateQuery(_, { subscriptionData }) {
      const publicLinks = subscriptionData.data.publicLinkUpdates?.publicLinks
      // if we return empty array here, the actual query will be aborted, because we have fetchPolicy "cache-and-network"
      // if we return existing value, it will throw an error, because "publicLinks" doesn't exist yet on the query result
      if (!publicLinks) {
        return null as unknown as PublicLinksQuery
      }
      return {
        publicLinks,
      }
    },
  })

  const links = computed(() => {
    const publicLinks = publicLinksQuery.result()

    return publicLinks.value?.publicLinks || []
  })

  return { links }
}
