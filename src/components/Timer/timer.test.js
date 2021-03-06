import { expect } from 'code'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import React from 'react'
import { Timer } from './timer'

describe('Given `Timer`', () => {

    let component,
        sandbox,
        sandboxProps,
        controlTimerSpy,
        resetTimerSpy,
        updateTimerSpy,
        decrementTimerSpy,
        fetchTimerSpy,
        createTimerSpy,
        clearIntervalSpy

    const currentTime = 60
    const mockDefaultTime = 40
    const mockDefaultTimer = {
        currentTime: 60,
        defaultTime: 60,
        isTimerRunning: false
    }

    function requiredProps(overrides= {}) {
        return {
            currentTime,
            controlTimer: controlTimerSpy,
            resetTimer: resetTimerSpy,
            updateTimer: updateTimerSpy,
            decrementTimer: decrementTimerSpy,
            fetchTimer: fetchTimerSpy,
            createTimer: createTimerSpy,
            isTimerRunning: false,
            parentId: 'admin',
            clearInterval: clearIntervalSpy,
            ...overrides
        }
    }

    function renderComponent(props=requiredProps()) {
        const newProps = requiredProps(props)
        return shallow(<Timer {...newProps}/>)
    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        controlTimerSpy = sandbox.spy()
        resetTimerSpy = sandbox.spy()
        updateTimerSpy = sandbox.spy()
        decrementTimerSpy = sandbox.spy()
        createTimerSpy = sandbox.spy()
        fetchTimerSpy = sandbox.spy()
        clearIntervalSpy = sandbox.spy()
        component = renderComponent()
    })

    afterEach(() => {
        sandbox.restore()
    })
    
    it('it should exist as a `section` tag', () => {
        
        expect(component.type()).to.equal('section')

    })

    
    describe('When mounted', () => {

        it('should dispatch createTimer() and fetchTimer()', () => {

            sinon.assert.calledOnce(createTimerSpy)

            sinon.assert.calledOnce(fetchTimerSpy)

        })
    })

    describe('When it is the `admin` timer', () => {

        it('should contain a `.admin-timer-controls` container', () => {

            expect(component.find('.admin-timer-controls').type()).to.equal('div')

        })

        it('should contain a `.timer` input which contains a currentTime', () => {

            expect(component.find('.timer').props().value).to.equal(currentTime)
    
        })
    
        describe('When it is updated', () => {
    
            beforeEach(() => {
                component.find('.timer').simulate('change', { target: { value: '40' } })
            })
    
            it('should dispatch `updateTimer`', () => {
    
                sinon.assert.calledOnce(updateTimerSpy)
    
            })
    
        })
    
        it('should contain a `.control-timer-button`', () => {
    
            expect(component.find('.control-timer-button').type()).to.equal('button')
    
        })
    
        describe('Given `.control-timer-button', () => {
    
            describe('when the timer is stopped', () => {
                
                it('should contain the text `Start`', () => {
    
                    expect(component.find('.control-timer-button').text()).to.equal('Start')
    
                })
    
                it('should be disabled if the timer value is 0', () => {
    
                    component = renderComponent({ currentTime: 0 })
    
                    expect(component.find('.control-timer-button').props().disabled).to.equal(true)
    
                })
    
                it('should not be disabled if the timer value is > 0', () => {
    
                    component = renderComponent()
                    
                    expect(component.find('.control-timer-button').props().disabled).to.equal(false)
    
                })
    
                describe('When the button is clicked', () => {
    
                    let clock
    
                    beforeEach(() => {
                        clock = sinon.useFakeTimers({ shouldAdvanceTime: true })
                        component.find('.control-timer-button').simulate('click')
                    })
    
                    afterEach(() => {
                        clock.restore()
                    })
    
                    it('should call controlTimer to update the state', () => {
        
                        sinon.assert.calledOnce(controlTimerSpy)
                    
                    })
    
                    it('should create a timer to dispatch `decrementTimer` every second', () => {            
    
                        clock.next();           
    
                        sinon.assert.calledOnce(decrementTimerSpy)
    
                    })
    
                    it('should clear intervalId if the timer is not running', () => {
                        
                        expect(component.state().intervalId).not.to.be.undefined()

                        component = renderComponent({ isTimerRunning: false })

                        expect(component.state().intervalId).to.be.undefined()
                        
                    })
                })
    
            })
    
            describe('when the timer is started with a timer value > 0', () => {
    
                beforeEach(() => {
                    component = renderComponent({ isTimerRunning: true })
                })
                
                it('should contain the text `Pause`', () => {
    
                    expect(component.find('.control-timer-button').text()).to.equal('Pause')
    
                })
    
                describe('When the button is clicked', () => {
    
                    it('should call controlTimer to update the state', () => {
    
                        component.find('.control-timer-button').simulate('click')
        
                        sinon.assert.calledOnce(controlTimerSpy)
                    
                    })
    
                })
            })
        })
    
        it('should contain a `.reset-timer-button`', () => {
    
            expect(component.find('.reset-timer-button').type()).to.equal('button')
    
        })
    
        describe('Given `.reset-timer-button`', () => {
    
            describe('When it is clicked', () => {
    
                beforeEach(() => {
                    component.find('.reset-timer-button').simulate('click')
                })
    
                it('should dispatch `resetTimer`', () => {
    
                    sinon.assert.calledOnce(resetTimerSpy)
    
                })
    
                it('should reset the `currentTime` to the `defaultTime`', () => {
    
                    expect(component.state().currentTime).to.equal(currentTime)
    
                })
    
            })
    
        })

    })

    describe('When it is not the `admin` timer', () => {

        it('should not contain a `.admin-timer-controls` container', () => {

            component = renderComponent({ parentId: 'teams' })

            expect(component.find('.admin-timer-controls').exists()).to.be.false()

        })

    })
    

    describe('When componentWillReceiveProps() is called', () => {

        beforeEach(() => {

            component.setState({ timer: mockDefaultTimer, currentTime: 40, intervalId: 1 })
            component.setProps({ timer: mockDefaultTimer, currentTime: 40, intervalId: 1 })
        })

        it('should update currentTime if there were changes', () => {

            expect(component.state().currentTime).to.equal(40)
        })

        it('should clear the intervalId when timer is at 0', () => {

            const timerTest = {
                currentTime: 0,
                defaultTime: 60,
                isTimerRunning: false
            }

            component.setState({ timer: timerTest, currentTime: 0, intervalId: 2 })

            expect(component.state().intervalId).not.to.be.undefined();

            component.setProps({ timer: timerTest, currentTime: 0, intervalId: 2 })

            expect(component.state().intervalId).to.be.undefined();
        })
    })
})