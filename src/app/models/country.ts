export interface Country {
    name: {
      common: string;
      official: string;
    };
    capital: string;
    region: string;
    flags: {
        png: string;
        svg: string;
        alt: string;
    }
  }
  