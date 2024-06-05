import {
  RetirementCertificates,
  CertificateMinted as CertificateMintedEvent,
  EventsAttached as EventsAttachedEvent,
} from '../generated/RetirementCertificates/RetirementCertificates';
import { log } from '@graphprotocol/graph-ts';
import {
  Retirement,
  RetirementCertificate,
} from '../generated/schema';

export function handleCertificateMinted(event: CertificateMintedEvent): void {
  log.info('Certificate Minted: {}', [`${event.params.tokenId}`]);
  const contractCallerAddress = event.address;
  const certificateId = event.params.tokenId;
  log.info('Certificate address: {}', [`${contractCallerAddress}`]);
  const certificateContract = RetirementCertificates.bind(contractCallerAddress);
  const res = certificateContract.try_getData(certificateId);
  if (res.reverted) {
    log.critical('Certificate not found: {}', [`${certificateId}`]);
    return;
  }
  const certificateData = res.value;
  const certificate = new RetirementCertificate(`${certificateId}`);
  certificate.createdAt = event.block.timestamp;
  certificate.creationTx = event.transaction.hash.toHexString();
  certificate.beneficiary = certificateData.beneficiary.toHexString();
  certificate.beneficiaryString = certificateData.beneficiaryString;
  certificate.updateTxs = [];
  certificate.retiringEntity = certificateData.retiringEntity.toHexString();
  certificate.retirementMessage = certificateData.retirementMessage;
  certificate.retiringEntityString = certificateData.retiringEntityString;
  certificate.save();

}

export function handleEventAttached(event: EventsAttachedEvent): void {
  log.info('Events Attached: {} {} ', [`${event.params.eventIds}`, `${event.params.tokenId}`]);
  const events = event.params.eventIds;
  for (let i = 0; i < events.length; i++) {
    const retirement = Retirement.load(`${events[i]}`);
    if (!retirement) {
      log.critical('Retirement not found: {}', [`${events[i]}`]);
      return;
    }
    retirement.certificate = `${event.params.tokenId}`;
    retirement.save();
  }
}
