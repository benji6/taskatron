import { gql } from 'apollo-boost'
import { resultsPerPage } from '.'

export default gql`
  query Services(
    $carpetClean: Boolean
    $deepClean: Boolean
    $general: Boolean
    $hasOwnEquipment: Boolean
    $hasOwnProducts: Boolean
    $ovenClean: Boolean
    $skip: Int!
  ) {
    services(
      deepClean: $deepClean
      carpetClean: $carpetClean
      general: $general
      hasOwnEquipment: $hasOwnEquipment
      hasOwnProducts: $hasOwnProducts
      ovenClean: $ovenClean
      skip: $skip
      limit: ${resultsPerPage}
    ) {
      nodes {
        carpetClean
        deepClean
        description
        general
        hasOwnEquipment
        hasOwnProducts
        hourlyRate
        id
        name
        ovenClean
        radius
      }
      total
    }
  }
`
