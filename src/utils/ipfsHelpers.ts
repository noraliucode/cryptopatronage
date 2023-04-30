import IPFSService from "../services/ipfsServices";

export const fetchPersonalInfo = async (address: string) => {
  const ipfsService = new IPFSService();
  const info = await ipfsService.fetchIPFSData();
  return info[address];
};
