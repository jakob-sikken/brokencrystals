import { EntityManager } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { JwtTokenProcessor as JwtTokenProcessor } from './jwt.token.processor';
import { encode, decode } from 'jwt-simple';
import { HttpClientService } from '../../httpclient/httpclient.service';

export class JwtTokenWithX5CKeyProcessor extends JwtTokenProcessor {
  constructor(private key: string) {
    super(new Logger(JwtTokenWithX5CKeyProcessor.name));
  }

  async validateToken(token: string): Promise<any> {
    this.log.debug('Call validateToken');
    const [header, payload] = this.parse(token);
    if (header.alg === 'None') {
      return payload;
    }
    const keys = header.x5c;
    this.log.debug(`Taking keys from from ${JSON.stringify(keys)}`);
    return decode(token, keys[0], false, header.alg);
  }

  async createToken(payload: unknown): Promise<string> {
    this.log.debug('Call createToken');
    return encode(payload, this.key, 'HS256');
  }
}
