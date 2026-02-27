export interface DetailProp {
  id: string;
  url: string;
  urlName: string | undefined;
}

export interface SectionProp {
  id: string;
  name: string;

  color: string;
  details: DetailProp[];
}
