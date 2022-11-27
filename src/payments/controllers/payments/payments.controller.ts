import { Controller, Body, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePaymentDto } from '../../dtos/CreatePayment.dto';
import { PaymentsService } from '../../services/payments/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get('')
  getPayments(@Req() req: Request, @Res() res: Response) {
    const { count, page } = req.query;
    if (!count || !page) {
      res.status(400).send({ msg: 'Missing count or page query parameter' });
    }
    res.send(200);
  }

  @Post('create')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const response = await this.paymentsService.createPayment(createPaymentDto);
    if (response) {
      return response;
    }
  }
}
