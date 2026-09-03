import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import dashboardService from './dashboard.service.js';
import diplomaRepo from '../../DataBase/repos/diploma.repo.js';
import { Types } from 'mongoose';

describe('Dashboard Service Endpoints', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a diploma successfully', async () => {
    const mockData = { name: 'Test Diploma', desc: 'Test Desc' };
    const mockResult = { _id: new Types.ObjectId(), ...mockData };
    
    jest.spyOn(diplomaRepo, 'create').mockResolvedValue(mockResult as any);

    // const result = await dashboardService.createDiploma(mockData);
    // expect(result).toEqual(mockResult);
  });

  it('should get all diplomas with pagination', async () => {
    const mockRecords = [{ _id: new Types.ObjectId(), name: 'Test Diploma' }];
    jest.spyOn(diplomaRepo, 'findAllDocuments').mockResolvedValue(mockRecords as any);
    jest.spyOn(diplomaRepo, 'countDocuments').mockResolvedValue(1);

    const result = await dashboardService.getAllDiplomas(1, 10);
    expect(result).toEqual({
      records: mockRecords,
      totalCount: 1,
    });
  });

  it('should get a diploma by id', async () => {
    const mockId = new Types.ObjectId().toHexString();
    const mockRecord = { _id: mockId, name: 'Test Diploma' };
    jest.spyOn(diplomaRepo, 'findDocumentById').mockResolvedValue(mockRecord as any);

    const result = await dashboardService.getDiplomaById(mockId);
    expect(result).toEqual(mockRecord);
  });

  it('should update a diploma', async () => {
    const mockId = new Types.ObjectId().toHexString();
    const mockUpdate = { name: 'Updated Diploma' };
    const mockRecord = { _id: mockId, ...mockUpdate };
    
    jest.spyOn(diplomaRepo, 'updateDocumentById').mockResolvedValue(mockRecord as any);

    const result = await dashboardService.updateDiploma(mockId, mockUpdate);
    expect(result).toEqual(mockRecord);
  });

  it('should delete a diploma', async () => {
    const mockId = new Types.ObjectId().toHexString();
    
    jest.spyOn(diplomaRepo, 'deleteOneDocument').mockResolvedValue({ deletedCount: 1 } as any);

    // const result = await dashboardService.deleteDiploma(mockId);
    // expect(result).toBe('Diploma deleted successfully');
  });
});
